# REFACTOR DASH

React dashboard tracking Google Local Services Ads performance across multiple service-business locations. Pulls daily ad spend, leads, and cost-per-lead, then surfaces trends across markets in one view.

## What it does

A Python collector (Playwright) scrapes 7 Local Services Ads accounts daily, normalizes the data, and pushes it to this repo. The React front end reads that data and renders six analysis tabs — Overview, Geo, Weekly, Efficiency, Daily, and Share — with month-over-month trend arrows and per-location breakdowns.

## Stack

React, Vite, Playwright, GitHub Actions (scheduled collection), Vercel (production deploy).

## How it runs

The collector runs on a daily schedule, writes fresh month data into `src/data/`, and commits automatically. The dashboard rebuilds and deploys to Vercel from `main`. Adding a new month is one new data file plus one import line.

## Notes

Migrated from Create React App to Vite to resolve cascading dependency failures. Single source of truth in `src/data/index.js` keeps locations, date ranges, and aggregates consistent across all tabs.
