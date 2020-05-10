import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "../../login/auth.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Attachment, AttachmentMessage, AttachmentType, MessageType } from "../../message-stream/message-stream.models";
import { MessageStreamService } from "../../message-stream/message-stream.service";
import { FormBuilder, FormControl } from "@angular/forms";
import { UserApi } from "../../api/user-api";

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent implements OnInit {

    @ViewChild('FileSelectInput') fileSelectInput: ElementRef;

    fileInput: FormControl;
    sendButton: FormControl;

    constructor(public auth: AuthService,
                public messageStreamService: MessageStreamService,
                public dialogRef: MatDialogRef<FileUploadDialogComponent>,
                private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit(): void {
        this.fileInput = new FormControl();
        this.sendButton = new FormControl({ enabled: false});
        this.fileInput.valueChanges.subscribe(value => {
            const inputElement: HTMLInputElement = this.fileSelectInput.nativeElement;
            if (inputElement.files && inputElement.files[0] && inputElement.files[0].name) {
                this.sendButton.enable()
            } else {
                this.sendButton.disable()
            }
        })
    }

    public openFilesSelectDialog() {
        const e: HTMLInputElement = this.fileSelectInput.nativeElement;
        e.click();
    }

    async sendFile(): Promise<void> {
        const inputElement: HTMLInputElement = this.fileSelectInput.nativeElement;
        const file = inputElement.files[0]
        await this.messageStreamService.sendFile("", file)
        this.close();
        return Promise.resolve();
    }

    getFileName(): string {
        if (this.fileSelectInput) {
            const inputElement: HTMLInputElement = this.fileSelectInput.nativeElement;
            return inputElement && inputElement.files && inputElement.files[0] ? inputElement.files[0].name : '';
        }
        return '';
    }

    getFileSize(): string {
        if (this.fileSelectInput) {
            const inputElement: HTMLInputElement = this.fileSelectInput.nativeElement;
            if (inputElement && inputElement.files && inputElement.files[0]) {
                const bytes = inputElement.files[0].size
                return Math.ceil(bytes/1024) + 'KB'
            } else {
                return ''
            }
        }
        return '';
    }

    close(): void {
        this.dialogRef.close();
    }
}
