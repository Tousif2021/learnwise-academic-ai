
export type FileCategory = "lectures" | "notes" | "exams" | "miscellaneous";

export interface OrganizedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: FileCategory;
  uploadDate: Date;
}
