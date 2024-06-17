import { BoardItemModel } from "./board-item.model";

export interface BoardVersionModel {
  _id: string
  createdAt: string
  boardItems: BoardItemModel[]
}