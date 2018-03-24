import axios from 'axios';
import {IUserDTO} from '../../shared/IUserDTO';
import {ISignInReplyDTO} from '../../shared/ISignInReplyDTO';
import {ISignInRequestDTO} from '../../shared/ISignInRequestDTO';
import {ICoursesRequestDTO} from '../../shared/ICoursesRequestDTO';
import {ICoursesReplyDTO} from '../../shared/ICoursesReplyDTO';
import {ICourseAddRequestDTO} from '../../shared/ICourseAddRequestDTO';
import {IReplyDTO} from '../../shared/IReplyDTO';
import {ICoursesUpdateRequestDTO} from '../../shared/ICoursesUpdateRequestDTO';
import {IProjectsRequestDTO} from '../../shared/IProjectsRequestDTO';
import {IProjectsAddReplyDTO} from '../../shared/IProjectsAddReplyDTO';
import {IProjectsReplyDTO} from '../../shared/IProjectsReplyDTO';
import {IProjectsAddRequestDTO} from '../../shared/IProjectsAddRequestDTO';
import {IProjectsUpdateRequestDTO} from '../../shared/IProjectsUpdateRequestDTO';
import {IDeleteRequestDTO} from '../../shared/IDeleteRequestDTO';
import {IStudentsReplyDTO} from '../../shared/IStudentsReplyDTO';
import {IStudentsRequestDTO} from '../../shared/IStudentsRequestDTO';
import {IStudentsUpdateRequestDTO} from '../../shared/IStudentsUpdateRequestDTO';
import {IStudentsAddRequestDTO} from '../../shared/IStudentsAddRequestDTO';
import {IInstructorsRequestDTO} from '../../shared/IInstructorsRequestDTO';
import {IInstructorsReplyDTO} from '../../shared/IInstructorsReplyDTO';
import {IInstructorsUpdateRequestDTO} from '../../shared/IInstructorsUpdateRequestDTO';
import {IInstructorsAddRequestDTO} from '../../shared/IInstructorsAddRequestDTO';

// Authorization

export function signInAPI(data: ISignInRequestDTO) {
    return axios.post(`/api/sign-in`, data)
        .then(res => res.data as ISignInReplyDTO);
}

// Courses

export function fetchCoursesAPI(request: ICoursesRequestDTO) {
    return axios.post('/api/courses-fetch', request)
        .then(res => res.data as ICoursesReplyDTO);
}

export function updateCoursesAPI(request: ICoursesUpdateRequestDTO) {
    return axios.post('/api/courses-update', request)
        .then(res => res.data as IReplyDTO);
}

export function addCoursesAPI(request: ICourseAddRequestDTO) {
    return axios.post('/api/courses-add', request)
        .then(res => res.data as IReplyDTO);
}

export function deleteCoursesAPI(request: IDeleteRequestDTO) {
    return axios.post('/api/courses-delete', request)
        .then(res => res.data as IReplyDTO);
}

// Projects

export function fetchProjectsAPI(request: IProjectsRequestDTO) {
    return axios.post('/api/projects-fetch', request)
        .then(res => res.data as IProjectsReplyDTO);
}

export function updateProjectsAPI(request: IProjectsUpdateRequestDTO) {
    return axios.post('/api/projects-update', request)
        .then(res => res.data as IReplyDTO);
}

export function addProjectsAPI(request: IProjectsAddRequestDTO) {
    return axios.post('/api/projects-add', request)
        .then(res => res.data as IProjectsAddReplyDTO);
}

export function deleteProjectsAPI(request: IDeleteRequestDTO) {
    return axios.post('/api/projects-delete', request)
        .then(res => res.data as IReplyDTO);
}

// Students

export function fetchStudentsAPI(request: IStudentsRequestDTO) {
    return axios.post('/api/students-fetch', request)
        .then(res => res.data as IStudentsReplyDTO);
}

export function updateStudentsAPI(request: IStudentsUpdateRequestDTO) {
    return axios.post('/api/students-update', request)
        .then(res => res.data as IReplyDTO);
}

export function addStudentsAPI(request: IStudentsAddRequestDTO) {
    return axios.post('/api/students-add', request)
        .then(res => res.data as IReplyDTO);
}

export function deleteStudentsAPI(request: IDeleteRequestDTO) {
    return axios.post('/api/students-delete', request)
        .then(res => res.data as IReplyDTO);
}

// Instructors

export function fetchInstructorsAPI(request: IInstructorsRequestDTO) {
    return axios.post('/api/instructors-fetch', request)
        .then(res => res.data as IInstructorsReplyDTO);
}

export function updateInstructorsAPI(request: IInstructorsUpdateRequestDTO) {
    return axios.post('/api/instructors-update', request)
        .then(res => res.data as IReplyDTO);
}

export function addInstructorsAPI(request: IInstructorsAddRequestDTO) {
    return axios.post('/api/instructors-add', request)
        .then(res => res.data as IReplyDTO);
}

export function deleteInstructorsAPI(request: IDeleteRequestDTO) {
    return axios.post('/api/instructors-delete', request)
        .then(res => res.data as IReplyDTO);
}