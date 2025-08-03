import VercelBlogWithPrivacy from "@/components/blog/VercelBlogWithPrivacy";
import { blogPosts } from '@/lib/content';

export default function Home() {
  return <VercelBlogWithPrivacy initialPosts={blogPosts} />;
}
