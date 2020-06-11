import * as vscode from "vscode";

const COMMAND = "case-change";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      [
        { scheme: "file", language: "javascript" },
        { scheme: "file", language: "typescript" },
        { scheme: "file", language: "html" },
        { scheme: "file", language: "css" },
        { scheme: "file", language: "less" },
        { scheme: "file", language: "typescriptreact" },
        { scheme: "file", language: "scss" },
        { scheme: "file", language: "python" },
        { scheme: "file", language: "markdown" },
        { scheme: "file", language: "json" },
        { scheme: "file", language: "javascriptreact" },
        { scheme: "file", language: "sass" },
      ],
      new ChangeCase(),
      {
        providedCodeActionKinds: ChangeCase.providedCodeActionKinds,
      }
    )
  );
}

export class ChangeCase implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    var editor = vscode.window.activeTextEditor;
    if (!editor) {
      return; // No open text editor
    }

    var selection = editor.selection;
    var text = editor.document.getText(selection);

    const changeToSnakeCase = this.createFix(
      document,
      range,
      "Snake Case",
      text
    );
    const changeToCamelCase = this.createFix(
      document,
      range,
      "Camel Case",
      text
    );

    const changeToCapitalCase = this.createFix(
      document,
      range,
      "Capital Case",
      text
    );

    const changeToLowerCase = this.createFix(
      document,
      range,
      "Lower Case",
      text
    );

    const changeToKebabCase = this.createFix(
      document,
      range,
      "Kebab Case",
      text
    );

    const changeToConstantCase = this.createFix(
      document,
      range,
      "Constant Case",
      text
    );
    changeToCamelCase.isPreferred = true;
    return [
      changeToCamelCase,
      changeToSnakeCase,
      changeToKebabCase,
      changeToCapitalCase,
      changeToLowerCase,
      changeToConstantCase,
    ];
  }

  toConstantCase(text: string) {
    // @ts-ignore
    var constantCaseText = text
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .map((x) => x.toUpperCase())
      .join("_");
    return constantCaseText;
  }

  toSnakeCase(text: string) {
    // @ts-ignore
    var snakeCaseText = text
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .map((x) => x.toLowerCase())
      .join("_");
    return snakeCaseText;
  }

  toCamelCase(text: string) {
    var camelCaseText = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    return camelCaseText;
  }

  toKebabCase(text: string) {
    // @ts-ignore
    var kebabCaseText = text
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .map((x) => x.toLowerCase())
      .join("-");
    return kebabCaseText;
  }

  mapFunctionToArguments(emoji: string, text: string) {
    switch (emoji) {
      case "Snake Case":
        return this.toSnakeCase(text);
      case "Camel Case":
        return this.toCamelCase(text);
      case "Kebab Case":
        return this.toKebabCase(text);
      case "Capital Case":
        return text.toUpperCase();
      case "Lower Case":
        return text.toLowerCase();
      case "Constant Case":
        return this.toConstantCase(text);
    }
  }

  private createFix(
    document: vscode.TextDocument,
    range: vscode.Range,
    emoji: string,
    text: string
  ): vscode.CodeAction {
    const fix = new vscode.CodeAction(
      `Change Case to ${emoji}`,
      vscode.CodeActionKind.QuickFix
    );
    fix.edit = new vscode.WorkspaceEdit();
    fix.edit.replace(
      document.uri,
      new vscode.Range(range.start, range.end),
      // @ts-ignore
      this.mapFunctionToArguments(emoji, text)
    );

    return fix;
  }
}