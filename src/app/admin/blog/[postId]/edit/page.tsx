'use client';

import { useParams } from 'next/navigation';
import BlogEditor from '../../_components/BlogEditor';

export default function EditBlogPost() {
  const params = useParams();
  return <BlogEditor postId={params.postId as string} />;
}
