// 'use client';

import axios from 'axios'
import { ACCESS_TOKEN } from './constants';
import { NextResponse } from 'next/server';

export default axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const axiosAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});