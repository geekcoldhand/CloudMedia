# 📄 Project Requirements Document (PRD)

**Project Name:** Ephemeral Image Uploader  
**Author:** Horatious Harris II
**Date:** April 12, 2025

We are excited to announce *Ephemeral Image Uploader*, a lightweight, serverless image upload demo built with AWS and modern frontend technologies. Designed for developers looking to get hands-on with Vercel, S3, Lambda, Pulumi, and Next.js, this project is perfect for learning cloud architecture without incurring costs or persisting data.

### 🔗 Live Demo  
[cloud-media-git-main-geekcoldhands-projects.vercel.app](https://cloud-media-git-main-geekcoldhands-projects.vercel.app)

---

## 📌 Audience

link []
- **Primary:** Early to mid-level web developers looking to gain hands-on experience with modern cloud tools and frontend frameworks.
- **Secondary:** DevOps and platform engineering learners interested in Infrastructure as Code (IaC), AWS, and serverless design patterns.
- **Tertiary:** Recruiters or hiring managers reviewing a portfolio project that demonstrates

---

## 🧩 PRFAQ – Press Release & FAQ

### 📢 Press Release Excerpt (Internal Only)

**FOR IMMEDIATE RELEASE**  
We are excited to announce *Ephemeral Image Uploader*, a lightweight, serverless image upload demo built with AWS and modern frontend technologies. Designed for developers looking to get hands-on with Vercel, S3, Lambda, Pulumi, and Next.js, this project is perfect for learning cloud architecture without incurring costs or persisting data.

### ❓ FAQ

**Q: What is this app?**  
A single-page web app that lets users upload an image, view it briefly, and deletes the image automatically from AWS S3 after a short period (e.g., 24 hours or less).

**Q: Why not persist data?**  
This project is for practice. To stay within AWS’s Free Tier and avoid cleanup responsibilities, no data is retained permanently.

**Q: What’s the backend built with?**  
AWS S3 (storage), Lambda (trigger on upload), and IAM roles configured via Pulumi (IaC). No server.

**Q: What about the frontend?**  
A sleek UI powered by Next.js, shadcn/ui components, and deployed to Vercel.

**Q: Why Pulumi?**  
To define cloud resources with code (TypeScript), reinforcing the DevOps principle of infrastructure-as-code.

**Q: Can this be scaled or extended?**  
Absolutely. The app could later integrate image recognition, secure uploads, or permanent storage if needed.

---

## 🎯 Scope

### ✅ In Scope

- Upload image from frontend to temporary S3 bucket
- Display uploaded image back to user
- Trigger Lambda on S3 upload
- Define all AWS resources using Pulumi (no manual console setup)
- Use CORS and IAM policies for proper access
- Deploy frontend via Vercel
- Auto-delete image after ~1 hour using S3 lifecycle rules
- Ensure cost stays within AWS Free Tier

### ❌ Out of Scope

- Persistent storage
- Authentication (no login needed)
- Complex image processing
- Paid AWS resources

---

## 🧑‍💻 User Stories

### As a **developer**, I want:

- to upload an image via the UI and see it immediately  
- to view the image URL pulled from S3  
- to have the image automatically deleted soon after upload  
- to define all infrastructure using Pulumi  
- to deploy the frontend on Vercel with no server  
- to stay within the AWS Free Tier and avoid costs  

---

## 📐 Non-Functional Requirements

| Requirement                 | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| 🔐 Security                | S3 bucket must be private; only allow upload via signed URL or CORS         |
| 🧪 Observability           | Lambda logs must go to CloudWatch                                            |
| ⏱️ Performance            | Upload + display latency should be under 1.5 seconds                        |
| 🌐 Scalability             | Can support many simultaneous uploads (no server bottlenecks)               |
| 💸 Cost                    | Must not exceed AWS Free Tier (no persistent storage or DB)                 |
| 🧹 Cleanup                 | Lifecycle rule ensures object auto-deletes after 1 hour max                |
| 🧱 Infrastructure as Code | All infra must be deployed via Pulumi in TypeScript                         |
| ⚙️ Deployment             | Frontend deploys automatically via Vercel                                   |

---

## 📊 Key Performance Indicators (KPIs)

| KPI                          | Target Goal                                                              |
|-----------------------------|---------------------------------------------------------------------------|
| 🟢 S3 Object Deletion Time  | ≤ 1 hour from upload (verifiable via CloudWatch logs if needed)           |
| 🚀 Deployment Time          | < 5 minutes end-to-end (Pulumi + Vercel)                                  |
| ✅ Successful Upload Rate   | 100% success for valid image uploads                                       |
| 🧼 Cost Audit               | $0 total on AWS account over 7-day trial                                  |
| 🧰 Hands-on Tool Coverage   | Used Pulumi, AWS CLI, Lambda, IAM, S3, Vercel, shadcn, and Next.js        |

---
