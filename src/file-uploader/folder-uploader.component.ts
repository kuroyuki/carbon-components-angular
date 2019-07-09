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
					<ibm-folder *ngFor="let f of folders.keys()" [folderItem]="folders.get(f)" (remove)="removeFolder(f)"></ibm-folder>
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
	@Input() folders: Map<string, FolderItem>;

	onFilesAdded() {
		const files = this.fileInput.nativeElement.files;
		for (let file of files) {
			let folderName = file["webkitRelativePath"].substr(0, file["webkitRelativePath"].lastIndexOf("/"));

			let folderItem = this.folders.get(folderName);
			if (!folderItem) {
				folderItem = { name: folderName, uploaded: false, state: "edit", files : []};
				this.folders.set(folderName, folderItem);
			}

			folderItem.files.push({
				uploaded: false,
				state: "edit",
				file: file
			});
		}
	}
	removeFolder(folderId) {
		this.folders.delete(folderId);
		this.filesChange.emit(this.folders);
	}
}
