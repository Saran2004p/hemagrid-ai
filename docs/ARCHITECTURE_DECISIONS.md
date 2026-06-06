# Architecture Decisions

## Frontend

React + Tailwind

Reason:
fast UI iteration and scalable component architecture

---

## Backend

Node + Express

Reason:
simple API integration and easy deployment on Render

---

## Database

Firebase Firestore

Reason:
fast setup and realtime support

Future:
possible migration to AWS

---

## AI Layer

Separate Python microservice

Reason:
keeps ML independent from frontend/backend

Recommended architecture:

React Frontend
↓
Node API
↓
Python ML Service
↓
Firestore Database
