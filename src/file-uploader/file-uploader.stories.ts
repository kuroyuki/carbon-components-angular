import { Component, Input } from "@angular/core";
import { storiesOf, moduleMetadata } from "@storybook/angular";

import { action } from "@storybook/addon-actions";
import {
	withKnobs,
	boolean,
	text,
	select,
	array
} from "@storybook/addon-knobs";

import {
	FileUploaderModule,
	NotificationModule,
	ButtonModule
} from "../";
import { NotificationService } from "../notification/notification.service";
import { FileItem } from "./file-item.interface";

import * as fileType from "file-type";
import { DocumentationModule } from "../documentation-component/documentation.module";

@Component({
	selector: "app-file-uploader",
	template: `
		<ibm-file-uploader
			[title]="title"
			[description]="description"
			[buttonText]="buttonText"
			[buttonType]="buttonType"
			[accept]="accept"
			[multiple]="multiple"
			[skeleton]="skeleton"
			[(files)]="files"
			[size]="size"
			[disabled]="disabled">
		</ibm-file-uploader>

		<div [id]="notificationId" style="width: 300px; margin-top: 20px"></div>
		<button ibmButton *ngIf="files && files.size > 0" (click)="onUpload()">
			Upload
		</button>
	`
})
class FileUploaderStory {
	static notificationCount = 0;

	@Input() notificationId = `notification-${FileUploaderStory.notificationCount}`;
	@Input() files = new Set();
	@Input() title;
	@Input() description;
	@Input() buttonText;
	@Input() buttonType = "primary";
	@Input() accept = [".jpg", ".png"];
	@Input() multiple;
	@Input() skeleton = false;
	@Input() size = "normal";
	@Input() disabled = false;

	protected maxSize = 500000;

	constructor(protected notificationService: NotificationService) {
		FileUploaderStory.notificationCount++;
	}

	onUpload() {
		this.files.forEach(fileItem => {
			if (!fileItem.uploaded) {
				if (fileItem.file.size < this.maxSize) {
					fileItem.state = "upload";
					setTimeout(() => {
						fileItem.state = "complete";
						fileItem.uploaded = true;
						console.log(fileItem);
					}, 1500);
				}

				if (fileItem.file.size > this.maxSize) {
					fileItem.state = "upload";
					setTimeout(() => {
						fileItem.state = "edit";
						fileItem.invalid = true;
						fileItem.invalidText = "File size exceeds limit";
					}, 1500);
				}
			}
		});
	}
}

@Component({
	selector: "app-drop-file-uploader",
	template: `
		<ibm-file-uploader
			[title]="title"
			[description]="description"
			[buttonText]="buttonText"
			[buttonType]="buttonType"
			[accept]="accept"
			[multiple]="multiple"
			[skeleton]="skeleton"
			[(files)]="files"
			[size]="size"
			drop="true"
			[dropText]="dropText"
			(filesChange)="onDropped($event)"
			[disabled]="disabled">
		</ibm-file-uploader>

		<div [id]="notificationId" style="width: 300px; margin-top: 20px"></div>
		<button ibmButton *ngIf="files && files.size > 0" (click)="onUpload()">
			Upload
		</button>
	`
})
class DragAndDropStory {
	static notificationCount = 0;

	@Input() notificationId = `notification-${FileUploaderStory.notificationCount}`;
	@Input() files = new Set();
	@Input() title;
	@Input() description;
	@Input() accept = [".jpg", ".png"];
	@Input() multiple;
	@Input() dropText = "Drag and drop files here of upload";
	@Input() disabled = false;

	protected maxSize = 500000;

	constructor(protected notificationService: NotificationService) {
		FileUploaderStory.notificationCount++;
	}

	// This is an example of further filtration which can take place after
	// preliminary filtration and is optional.
	onDropped(event) {
		const transferredFiles = Array.from(event);

		// Creates a promise which resolves to a file and whether or not the file should be accepted.
		const readFileAndCheckType = fileObj => {
			return new Promise((resolve, reject) => {
				let fileExtension, mime;
				let reader = new FileReader();
				reader.readAsArrayBuffer(fileObj.file);
				reader.onload = () => {
					// Checks the type of file based on magic numbers.
					const type = fileType(reader.result);
					if (type) {
						fileExtension = type.ext.replace(/^/, ".");
						mime = type.mime;
					} else {
						// If a file type can not be determined using magic numbers
						// then use file extension or mime type.
						fileExtension = fileObj.file.name.split(".").pop().replace(/^/, ".");
						mime = fileObj.file.type;
					}
					resolve({
						file: fileObj,
						accept: (this.accept.includes(fileExtension) || this.accept.includes(mime) || !this.accept.length)
					});
				};

				reader.onerror = error => {
					reject(error);
				};
			});
		};

		const promises = transferredFiles.map(file => readFileAndCheckType(file));

		Promise.all(promises).then(filePromiseArray =>
			filePromiseArray.filter(filePromise => filePromise.accept)
				.map(acceptedFile => acceptedFile.file))
				.then(acceptedFiles => this.files = new Set(acceptedFiles))
				.catch(error => console.log(error));
	}

	onUpload() {
		this.files.forEach(fileItem => {
			if (!fileItem.uploaded) {
				if (fileItem.file.size < this.maxSize) {
					fileItem.state = "upload";
					setTimeout(() => {
						fileItem.state = "complete";
						fileItem.uploaded = true;
						console.log(fileItem);
					}, 1500);
				}

				if (fileItem.file.size > this.maxSize) {
					fileItem.state = "upload";
					setTimeout(() => {
						fileItem.state = "edit";
						fileItem.invalid = true;
						fileItem.invalidText = "File size exceeds limit";
					}, 1500);
				}
			}
		});
	}
}


@Component({
	selector: "app-ngmodel-file-uploader",
	template: `
		<ibm-file-uploader
			[title]="title"
			[description]="description"
			[buttonText]="buttonText"
			[buttonType]="buttonType"
			[accept]="accept"
			[multiple]="multiple"
			[size]="size"
			[(ngModel)]="model"
			[disabled]="disabled">
		</ibm-file-uploader>

		<br><div [id]="notificationId" style="width: 300px"></div>
		<button ibmButton *ngIf="model && model.size > 0" (click)="onUpload()">
			Upload
		</button>

		<button ibmButton (click)="removeFiles()">Remove all</button>
	`
})
class NgModelFileUploaderStory {
	static notificationCount = 0;

	@Input() notificationId = `notification-${FileUploaderStory.notificationCount}`;
	@Input() title;
	@Input() description;
	@Input() buttonText;
	@Input() buttonType = "primary";
	@Input() accept;
	@Input() multiple;
	@Input() size = "normal";
	@Input() disabled = false;

	protected model = new Set();
	protected maxSize = 500000;

	constructor(protected notificationService: NotificationService) {
		FileUploaderStory.notificationCount++;
	}

	removeFiles() {
		this.model = new Set();
	}

	onUpload() {
		this.model.forEach(fileItem => {
			if (!fileItem.uploaded) {
				if (fileItem.file.size < this.maxSize) {
					fileItem.state = "upload";
					setTimeout(() => {
						fileItem.state = "complete";
						fileItem.uploaded = true;
						console.log(fileItem);
					}, 1500);
				}

				if (fileItem.file.size > this.maxSize) {
					fileItem.state = "upload";
					setTimeout(() => {
						fileItem.state = "edit";
						fileItem.invalid = true;
						fileItem.invalidText = "File size exceeds limit";
					}, 1500);
				}
			}
		});
	}
}

storiesOf("Components|File Uploader", module)
	.addDecorator(
		moduleMetadata({
			imports: [
				FileUploaderModule,
				NotificationModule,
				ButtonModule,
				DocumentationModule
			],
			declarations: [FileUploaderStory, NgModelFileUploaderStory, DragAndDropStory]
		})
	)
	.addDecorator(withKnobs)
	.add("Basic", () => ({
		template: `
			<app-file-uploader
				[title]="title"
				[description]="description"
				[buttonText]="buttonText"
				[buttonType]="buttonType"
				[accept]="accept"
				[multiple]="multiple"
				[size]="size"
				[disabled]="disabled">
			</app-file-uploader>
		`,
		props: {
			title: text("The title", "Account Photo"),
			description: text("The description", "only .jpg and .png files. 500kb max file size."),
			buttonText: text("Button text", "Add files"),
			buttonType: select("Button type", {
				Primary: "primary",
				Secondary: "secondary",
				Tertiary: "tertiary",
				Ghost: "ghost",
				Danger: "danger"
			}, "primary"),
			size: select("size", {Small: "sm", Normal: "normal"}, "normal"),
			accept: array("Accepted file extensions", [".png", "image/jpeg"], ","),
			multiple: boolean("Supports multiple files", true),
			disabled: boolean("Disabled", false)
		}
	}))
	.add("Drag and drop", () => ({
		template: `
		<app-drop-file-uploader
			[title]="title"
			[description]="description"
			[accept]="accept"
			[multiple]="multiple"
			[dropText]="dropText"
			drop="true"
			[disabled]="disabled">
		</app-drop-file-uploader>
	`,
	props: {
		title: text("The title", "Account Photo"),
		dropText: text("Drop container text", "Drag and drop files here or upload"),
		description: text("The description", "only .jpg and .png files. 500kb max file size."),
		accept: array("Accepted file extensions", [".png", "image/jpeg"], ","),
		multiple: boolean("Supports multiple files", true),
		disabled: boolean("Disabled", false)
	}
	}))
	.add("Using ngModel", () => ({
		template: `
			<app-ngmodel-file-uploader
				[title]="title"
				[description]="description"
				[buttonText]="buttonText"
				[buttonType]="buttonType"
				[accept]="accept"
				[multiple]="multiple"
				[size]="size"
				[disabled]="disabled">
			</app-ngmodel-file-uploader>
		`,
		props: {
			title: text("The title", "Account Photo"),
			description: text("The description", "only .jpg and .png files. 500kb max file size."),
			buttonText: text("Button text", "Add files"),
			buttonType: select("Button type", {
				Primary: "primary",
				Secondary: "secondary",
				Tertiary: "tertiary",
				Ghost: "ghost",
				Danger: "danger"
			}, "primary"),
			size: select("size", {Small: "sm", Normal: "normal"}, "normal"),
			accept: array("Accepted file extensions", [".png", ".jpg"], ","),
			multiple: boolean("Supports multiple files", true),
			disabled: boolean("Disabled", false)
		}
	}))
	.add("Skeleton", () => ({
		template: `
			<app-file-uploader skeleton="true"></app-file-uploader>
		`
	}))
	.add("Documentation", () => ({
		template: `
			<ibm-documentation src="documentation/classes/src_file_uploader.fileuploader.html"></ibm-documentation>
		`
	}));

