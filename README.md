# Efficient CRM

CRM service that allows you to work faster, create your own teams and invite members.

## Table of contents

- [Overview](#overview)
  - [Website](#website)
  - [What it contains](#what-it-contains)
- [Built with](#built-with)
- [Install process](#install-process)
- [Build process](#build-process)

## Overview

### Website

[App live demo](https://efficient-crm.vercel.app/) unfortunately not working currently, my free database was turned down.

### What it contains

- Creating teams;
- Safe authorization with Clerk service;
- Ability to invite up to 2 people to your team (Clerk free version restriction);
- RBAC:
  - Admin – allowed to view all teams’ data, modify teams, invite new members, edit dictionaries and delete data and/or entities;
  - Member – allowed to only view entities assigned to them;
- Leads – potential clients;
- Deals – offers made to a lead;
- Activities – appointments/events assigned to a lead;
- Analytics dashboard for quick view of current work state;
- Dictionaries allowing full customization of workflow.


## Built with

- [Clerk](https://clerk.com/)
- [MUI](https://mui.com/)
- [Recharts](https://recharts.org/en-US/)
- [tRPC](https://trpc.io/)
- [Prisma](https://www.prisma.io/)
- [Next](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [PlanetScale](https://planetscale.com/)
- [TanStack Query](https://react-query-v3.tanstack.com/)
- [Formik](https://formik.org/)
- [Zod](https://zod.dev/)
- [Yup](https://www.npmjs.com/package/yup)

## Install process

1. Install [Node.js](https://nodejs.org/en/download/)
2. Navigate to project folder in command line
3. Run `npm install`
4. Set all required env variables
5. Run `npm start`

## Build process

1. Open project folder in command line
2. Set all required env variables
3. Run `npm run build`
