import { Message, Session } from "@shared/schema";

export function exportMessageAsText(message: Message): void {
  const timestamp = new Date(message.timestamp).toLocaleString();
  const content = `[${message.role.toUpperCase()}] - ${timestamp}\n\n${message.content}\n`;
  
  downloadTextFile(content, `message-${message.id}.txt`);
}

export function exportSessionAsText(session: Session): void {
  const header = `Chat Session: ${session.title}\nDate: ${new Date(session.createdAt).toLocaleString()}\n${"=".repeat(60)}\n\n`;
  
  const messagesText = session.messages.map(msg => {
    const timestamp = new Date(msg.timestamp).toLocaleString();
    return `[${msg.role.toUpperCase()}] - ${timestamp}\n${msg.content}\n`;
  }).join("\n" + "-".repeat(60) + "\n\n");
  
  const content = header + messagesText;
  downloadTextFile(content, `${session.title.replace(/\s+/g, "-")}-${session.id}.txt`);
}

export function downloadCodeBlock(code: string, language: string = "text"): void {
  const extension = getExtensionForLanguage(language);
  downloadTextFile(code, `code-snippet.${extension}`);
}

function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getExtensionForLanguage(language: string): string {
  const extensions: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
    cpp: "cpp",
    c: "c",
    csharp: "cs",
    php: "php",
    ruby: "rb",
    go: "go",
    rust: "rs",
    swift: "swift",
    kotlin: "kt",
    html: "html",
    css: "css",
    json: "json",
    xml: "xml",
    yaml: "yaml",
    sql: "sql",
    bash: "sh",
    shell: "sh",
  };
  
  return extensions[language.toLowerCase()] || "txt";
}
