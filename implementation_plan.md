# Cloudinary Image Upload (Backend Only)

যেহেতু তোমার টিমমেটরা ফ্রন্টএন্ডে কাজ করছে, আমরা এখন শুধুমাত্র সার্ভার (Backend)-এ Cloudinary-র ব্যবস্থা করবো, যাতে তাদের কাজের সাথে কোনো গণ্ডগোল (Conflict) না হয়। 

## User Review Required

> [!WARNING]  
> Cloudinary-র কোডগুলো সার্ভারে অ্যাড করা হবে। তুমি যদি প্ল্যানে সম্মত হও, তাহলে আমি কাজ শুরু করবো। নিচে দেখো কী কী আপডেট করা হবে।

## Proposed Changes

---

### Backend System

#### [MODIFY] `server/.env`
- তোমার দেওয়া Cloudinary credentials (Cloud Name, API Key, API Secret) এখানে সেভ করা হবে। 

#### [NEW] `server/config/cloudinary.js`
- Cloudinary-র সার্ভারের সাথে আমাদের সার্ভারের কানেকশন সেটআপ করা হবে।

#### [NEW] `server/middleware/uploadMiddleware.js`
- `multer` ব্যবহার করে একটি middleware বানানো হবে, যেটা ফ্রন্টএন্ড থেকে আসা ছবিকে ধরবে এবং Cloudinary-তে সুন্দরভাবে আপলোড করবে। 

#### [MODIFY] `server/routes/propertyRoutes.js`
- `/api/properties` এর `POST` route-এ পরিবর্তন আসবে। 
- ফর্ম ডাটার সাথে আসা ছবিগুলো `multer` দিয়ে রিসিভ করে, Cloudinary-র দেওয়া URL-গুলো ডাটাবেসে `images` ফিল্ডে সেভ করা হবে।

## Open Questions

- তুমি কি চাও একই সাথে একাধিক ছবি (Multiple Images) আপলোড করার সিস্টেম রাখি, নাকি আপাতত একটা ছবির জন্য সেটআপ করবো? (একাধিক ছবি রাখাই ভালো, কারণ প্রপার্টি পোস্টে একাধিক ছবি লাগে)। 
- আমি কি কাজ শুরু করবো?
