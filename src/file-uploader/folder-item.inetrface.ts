import { FileItem } from "./file-item.interface";

export interface FolderItem {
    name: string;
	files: FileItem[];
	state: "edit" | "upload" | "complete";
	uploaded: boolean;
}