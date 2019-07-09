
import {
	Component,
	Input,
	Output,
	ViewChild,
	EventEmitter,
	OnInit,
	HostBinding
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { I18n } from "../i18n/i18n.module";
import { FileItem } from "./file-item.interface";
import { FolderItem } from "./folder-item.inetrface";

@Component({
	selector: "ibm-folder",
	template: `
		<p class="bx--file-filename">{{folderItem.name}}</p>
		<span
			*ngIf="folderItem.state === 'edit'"
			class="bx--file__state-container"
			(click)="remove.emit()"
			(keyup.enter)="remove.emit()"
			(keyup.space)="remove.emit()"
			tabindex="0">
			<ibm-icon-close16
				class="bx--file-close"
				[ariaLabel]="translations.REMOVE_BUTTON">
			</ibm-icon-close16>
		</span>
		<span *ngIf="folderItem.state === 'upload'">
			<ibm-loading size="sm"></ibm-loading>
		</span>
		<span
			*ngIf="folderItem.state === 'complete'"
			class="bx--file__state-container"
			tabindex="0">
			<ibm-icon-checkmark-filled16
				class="bx--file-complete"
				[ariaLabel]="translations.CHECKMARK">
			</ibm-icon-checkmark-filled16>
		</span>
	`
})
export class Folder {
	/**
	 * Accessible translations for the close and complete icons
	 */
	@Input() translations = this.i18n.get().FILE_UPLOADER;
	/**
	 * A single `FolderItem` from the set of `FolderItem`s
	 */
	@Input() folderItem: FolderItem;

	@Output() remove = new EventEmitter();

	@HostBinding("class.bx--file__selected-file") selectedFile = true;

	constructor(protected i18n: I18n) {}
}
