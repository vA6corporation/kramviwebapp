import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(
        private readonly http: HttpClient,
    ) { }

    accessToken: string | null = null
    private baseUrl: string = environment.baseUrl

    get(url: string, params?: Params): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
        });
        return this.http.get(`${this.baseUrl}${url}`, { headers, params })
    }

    async getFile(url: string): Promise<Blob> {
        const options = {
            headers: { Authorization: `Bearer ${this.accessToken}` }
        }
        const buffer = await fetch(`${this.baseUrl}${url}`, options)
            .then(res => {
                if (res.ok) {
                    return res.blob()
                } else {
                    throw new Error('Archivo no encontrado')
                }
            })
        return buffer
    }

    async getFileArray(url: string): Promise<ArrayBuffer> {
        const options = {
            headers: { Authorization: `Bearer ${this.accessToken}` }
        }
        const buffer = await fetch(`${this.baseUrl}${url}`, options)
            .then(res => {
                if (res.ok) {
                    return res.arrayBuffer()
                } else {
                    throw new Error('Archivo no encontrado')
                }
            })
        return buffer
    }

    post(url: string, body: any, params?: Params): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
        })
        return this.http.post(`${this.baseUrl}${url}`, body, { headers, params })
    }

    postFile(url: string, body: any): Observable<any> {
        const headers = new HttpHeaders({
            // 'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
        })
        return this.http.post(`${this.baseUrl}${url}`, body, { headers })
    }

    put(url: string, body: any): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
        })
        return this.http.put(`${this.baseUrl}${url}`, body, { headers })
    }

    delete(url: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
        })
        return this.http.delete(`${this.baseUrl}${url}`, { headers })
    }
}
