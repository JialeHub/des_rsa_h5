import {axiosG, axiosK} from '../index'

export const choicePostApi = data => axiosK('safeEiq/addSafeEiq', data) //添加问卷
export const sectionGetApi = data => axiosG('safeEiq/getData', data) //获得数据统计




