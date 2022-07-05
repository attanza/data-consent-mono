export class AddAttachmentEvent {
  constructor(public readonly resourceId: string, public readonly fileName: string) {}

  toString() {
    return JSON.stringify({
      resourceId: this.resourceId,
      fileName: this.fileName,
    });
  }
}
