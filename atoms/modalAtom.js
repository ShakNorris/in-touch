import { atom } from 'recoil';

export const createModalState = atom({
    key: 'createModalState',
    default: false,
})

export const searchModalState = atom({
    key: 'searchModalState',
    default: false,
})

export const postModalState = atom({
    key: 'postModalState',
    default: false,
})