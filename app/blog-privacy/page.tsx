import VercelBlogWithPrivacy from "@/components/blog/VercelBlogWithPrivacy";
import { blogPosts } from '@/lib/content';

export default function BlogPrivacyPage() {
  return <VercelBlogWithPrivacy initialPosts={blogPosts} />;
}