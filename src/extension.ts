import * as vscode from 'vscode';
import {Operation} from './operation';

var inMarkMode: boolean = false;
export function activate(context: vscode.ExtensionContext): void {
    let op = new Operation(),
        commandList: string[] = [
            "C-g",

            // Edit
            "C-d", "C-h", "M-d", "C-k", "C-w", "M-w", "C-y",
            "C-j", "C-m",
            "C-x_h",
            "C-x_u", "C-/", "C-x_z",
            "C-semicolon", "M-semicolon",
        ],
        cursorMoves: string[] = [
            "cursorUp", "cursorDown", "cursorLeft", "cursorRight",
            "cursorHome", "cursorEnd",
            "cursorWordLeft", "cursorWordRight",
            "cursorPageDown", "cursorPageUp",
            "cursorTop", "cursorBottom"
        ];

    commandList.forEach(commandName => {
        context.subscriptions.push(registerCommand(commandName, op));
    });

    cursorMoves.forEach(element => {
        context.subscriptions.push(vscode.commands.registerCommand(
            "emacs."+element, () => {
                vscode.commands.executeCommand(
                    inMarkMode ?
                    element+"Select" :
                    element
                );
            })
        )
    });

    initMarkMode(context);
}

export function deactivate(): void {
}

function initMarkMode(context: vscode.ExtensionContext): void {
    context.subscriptions.push(vscode.commands.registerCommand(
        'emacs.enterMarkMode', () => {
            initSelection();
            inMarkMode = true;
            vscode.window.setStatusBarMessage("Mark Set", 1000);
        })
    );

    context.subscriptions.push(vscode.commands.registerCommand(
        'emacs.exitMarkMode', () => {
            if (inMarkMode) {
                vscode.commands.executeCommand("cancelSelection");
                inMarkMode = false;
                vscode.window.setStatusBarMessage("Mark deactivated", 1000);
            }
        })
    );
}

function registerCommand(command_name: string, op: Operation): vscode.Disposable {
    return vscode.commands.registerCommand("emacs." + command_name, op.getCommand(command_name));
}

function initSelection(): void {
    var currentPosition: vscode.Position = vscode.window.activeTextEditor.selection.active;
    vscode.window.activeTextEditor.selection = new vscode.Selection(currentPosition, currentPosition);
}
