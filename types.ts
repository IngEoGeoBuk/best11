import { Date } from "mongoose";

export interface EmailType {
    email: string | string[],
}

export interface PlayerType {
    _id: string,
    no: number,
    name: string,
    club: string,
    logo: string
}

export interface ModelPlayerType {
    _id?: string,
    no: number,
    name: string,
    club: string,
    logo: string
}

export interface BoardType {
    _id: string,
    email: string,
    title: string,
    contents: string,
    players: string[],
    time: Date,
    updated_time?: Date
}

export interface ModelBoardType {
    email: string,
    title: string,
    contents: string,
    players: string[],
    time?: Date,
    updated_time?: Date
}

export interface HomeBoardType {
    boards: {
        _id: string,
        title: string
    }[]
}

export interface CreateBoardType {
    players: PlayerType[]
    clubs: string[]
}

export interface UpdateBoardType {
    players: PlayerType[],
    clubs: string[],
    boards: BoardType[],
    prevSelectedPlayers: PlayerType[]
}

export interface OptionType {
    label: string,
    value: string,
}

export interface CommentType {
    _id: string,
    coId?: string,
    poId: string,
    email: string,
    context: string,
    time: Date,
    updated_time?: Date
}

export interface ModelCommentType {
    poId: string,
    coId?: string,
    email: string,
    context: string,
    time?: Date,
    updated_time?: Date
}

export interface LikeDislikeType {
    email: string,
    poId: string
}

export interface ReadBoardType {
    boards: BoardType[],
    players: PlayerType[],
    comments: CommentType[],
    repplys: CommentType[]
}