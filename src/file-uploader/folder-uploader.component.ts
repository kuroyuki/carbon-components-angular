import { Component, Input } from "@angular/core";
import { FileUploader } from "./file-uploader.component";
import { FileItem } from "./file-item.interface";
import { FolderItem } from "./folder-item.inetrface";

/**
 * [See demo](../../?path=/story/file-uploader--folder-upload)
 *
 * <example-url>../../iframe.html?id=file-uploader--folder-upload</example-url>
 *
 * @export
 * @class FolderUploader
 * @implements {OnInit}
 */
@Component({
	selector: "ibm-folder-uploader",
	template: `
		<ng-container *ngIf="!skeleton; else skeletonTemplate">
			<strong class="bx--file--label">{{title}}</strong>
			<p class="bx--label-description">{{description}}</p>
			<div class="bx--file">
				<button
					ibmButton="primary"
					(click)="fileInput.click()"
					[attr.for]="fileUploaderId">
					{{buttonText}}
				</button>
				<input
					#fileInput
					type="file"
					class="bx--file-input"
					[accept]="accept"
                    [id]="fileUploaderId"
                    webkitdirectory
					[multiple]=true
					tabindex="-1"
					(change)="onFilesAdded()"/>
				<div class="bx--file-container">
					<ibm-folder *ngFor="let folderItem of folders" [folderItem]="folderItem" (remove)="removeFolder(folderItem)"></ibm-folder>
				</div>
			</div>
		</ng-container>

		<ng-template #skeletonTemplate>
			<div class="bx--skeleton__text" style="width: 100px"></div>
			<div class="bx--skeleton__text" style="width: 225px"></div>
			<button ibmButton skeleton="true"></button>
		</ng-template>
	`
})
export class FolderUploader extends FileUploader {
	/**
	 * The list of folders that have been submitted to be uploaded
	 */
	@Input() folders = new Set<FolderItem>();

	onFilesAdded() {
		const files = this.fileInput.nativeElement.files;
		if (!this.multiple) {
			this.files.clear();
		}
		const folderItem: FolderItem = {
			uploaded: false,
			state: "edit",
			name : "new",
			files : []
		};

		for (let file of files) {
			const fileItem: FileItem = {
				uploaded: false,
				state: "edit",
				file: file
			};
			folderItem.files.push(fileItem);
		}

		this.value = this.files;
		let filename = folderItem.files[0].file["webkitRelativePath"];
		folderItem.name = filename.substr(0, filename.lastIndexOf("/"));
		this.folders.add(folderItem);
	}
	removeFolder(folderItem) {
		this.folders.delete(folderItem);
		this.filesChange.emit(this.folders);
	}
}
