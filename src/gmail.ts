class MyGmail {
  public messages: GoogleAppsScript.Gmail.GmailMessage[] = [];

  constructor(query: string, max: number = 100) {
    this.search(query, max);
  }

  public search(query: string, max: number) {
    this.messages = [];
    let threads = GmailApp.search(query, 0, max);
    for (let thread of threads) {
      let messages = thread.getMessages();
      for (let message of messages) {
        if (message.isUnread()) {
          this.messages.push(message);
        }
      }
    }
  }

  public deleteAll() {
    for (let message of this.messages) {
      message.moveToTrash();
    }
    this.messages = [];
  }
}