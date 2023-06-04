# [Efficient CRM](https://efficient-crm.vercel.app/)

Free crm service, allowing you to work fast, create your own team and invite members.

## Table of contents

- [Overview](#overview)
  - [Website](#website)
  - [What it contains](#What-it-contains)
- [Built with](#built-with)
- [Install process](#install-process)
- [Build process](#build-process)

## Overview

### Website

[App live demo](https://efficient-crm.vercel.app/)

### What it contains

- Creating teams
- Safe authorization with Clerk service
- Invite up to 2 people to your team (Clerk free version restriction)
- RBAC 
    - Admin - allowed to view all team's data, modify team, invite new members, edit dictionaries, can delete things
    - Member - allowed to only view entities assigned to them
- Leads - potential clients
- Deals - offer made for lead
- Activities - appointments/event assigned to lead
- Analytics dashboard for quick view of current work state
- Dictionaries allowing you to fully customize your workflow

## Built with

- [clerk](https://clerk.com/)
- [mui](https://mui.com/)
- [recharts](https://recharts.org/en-US/)
- [tRPC](https://trpc.io/)
- [Prisma](https://www.prisma.io/)
- [Next](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Planetscale](https://planetscale.com/)
- [React-query](https://react-query-v3.tanstack.com/)
- [Formik](https://formik.org/)
- [Zod](https://zod.dev/)
- [Yup](https://www.npmjs.com/package/yup)

## Install process

1. Install [nodejs](https://nodejs.org/en/download/)
2. Navigate project folder in command line
3. Run `npm install`
4. Set all required env variables
5. Run `npm start`

## Build process

1. Open project folder in command line
2. Set all required env variables
3. Run `npm run build`
