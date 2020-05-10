import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from "@angular/forms";
import { MessageStreamService } from "../message-stream/message-stream.service";
import { MatDialog } from "@angular/material/dialog";
import { FileUploadDialogComponent } from "./file-upload-dialog/file-upload-dialog.component";

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit {

    messageInput: FormControl;

    constructor(private fb: FormBuilder,
                private messageStream: MessageStreamService,
                public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.messageInput = this.fb.control({ value: "", disabled: true});
        this.messageStream.currentFriendSubject$.subscribe(next => {
            if (next) {
                this.messageInput.enable();
            }
        })
    }

    sendMessage() {
        const text = this.messageInput.value;
        if (text && text.trim().length > 0) {
            this.messageInput.setValue("");
            this.messageStream.sendTextMessage(text);
        }
    }

    openFileUploadDialog(): void {
        this.dialog.open(FileUploadDialogComponent, {
            minWidth: '800px',
            data: {}
        });
    }

}
