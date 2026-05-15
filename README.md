# ImageKit Video Shop

A modern Next.js application for managing and selling video content using ImageKit integration. This project provides a full-featured platform with user authentication, video upload capabilities, and payment processing using Razorpay.

## Features

- 🔐 User Authentication (NextAuth.js)
- 📹 Video Upload and Management (ImageKit)
- 🎨 Modern UI with Tailwind CSS and DaisyUI
- 📱 Fully Responsive Design
- 🔒 Secure API Routes
- 🗄️ MongoDB Database Integration

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **Authentication**: NextAuth.js, JWT
- **Database**: MongoDB with Mongoose
- **File Storage**: ImageKit
- **Form Handling**: React Hook Form

## Prerequisites

- Node.js (Latest LTS version)
- MongoDB Database
- ImageKit Account

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd imagekit-video-main
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.local` from the project root (or create it)
   - Fill in the required environment variables with your credentials

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Database
MONGODB_URI=

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# ImageKit - Get these from your ImageKit dashboard
NEXT_PUBLIC_PUBLIC_KEY=
NEXT_PUBLIC_URL_ENDPOINT=
IMAGEKIT_PRIVATE_KEY=
```

### Required for Local Development:
- `NEXT_PUBLIC_PUBLIC_KEY` - Your ImageKit public key
- `NEXT_PUBLIC_URL_ENDPOINT` - Your ImageKit endpoint
- `IMAGEKIT_PRIVATE_KEY` - Your ImageKit private key (for server-side operations)
- `MONGODB_URI` - Your MongoDB connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Set to `http://localhost:3000` for development

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed the database
- `npm run mailtrap` - Test email configuration

## CI/CD

This repository includes a GitHub Actions workflow at [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Pipeline flow:

1. Install dependencies
2. Run lint
3. Run the production build
4. Build and push the Docker image to Docker Hub
5. Trigger the Render deploy webhook

### 1) GitHub Actions Trigger

The workflow currently triggers on pushes to `main`.

If your active branch is `master`, either:

- Rename your default branch to `main`, or
- Update [.github/workflows/deploy.yml](.github/workflows/deploy.yml) and change:

```yaml
on:
   push:
      branches:
         - main
```

to:

```yaml
on:
   push:
      branches:
         - master
```

### 2) Required GitHub Secrets

Add these repository secrets in GitHub:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_REPOSITORY`
- `DOCKERHUB_TOKEN`
- `RENDER_DEPLOY_HOOK_URL`

Where to add:

GitHub Repository -> Settings -> Secrets and variables -> Actions -> New repository secret

### 3) Docker Hub Setup

1. Create a Docker Hub repository (for example: `image-kit-shop`).
2. Use your Docker Hub username for `DOCKERHUB_USERNAME`.
3. Use your Docker Hub repository name for `DOCKERHUB_REPOSITORY`.
4. Create a Docker Hub Access Token and store it as `DOCKERHUB_TOKEN`.

Image tags pushed by CI:

- `latest`
- `sha-<commit>`

### 4) Render Setup

1. In Render, create a Web Service using Docker image deployment.
2. Set image path as:

    `docker.io/<DOCKERHUB_USERNAME>/<DOCKERHUB_REPOSITORY>:latest`

3. Copy the Render Deploy Hook URL and store it as `RENDER_DEPLOY_HOOK_URL` in GitHub Secrets.
4. Add your runtime environment variables in Render (database, auth, imagekit).

### 5) Deployment Result

After you push code to the configured branch:

1. GitHub Actions runs lint + build
2. New Docker image is pushed to Docker Hub
3. Render deploy hook is called
4. Render pulls latest image and deploys your app

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── components/      # Reusable components
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   └── upload/         # Video upload page
├── lib/                # Utility functions
├── models/             # MongoDB models
├── public/            # Static assets
└── types.d.ts         # TypeScript declarations
```

## Contributing

NO CONTRIBUTING PLEASE!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, watch youtube video