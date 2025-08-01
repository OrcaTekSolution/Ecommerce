'use client';

import { redirect } from 'next/navigation';

export default function AdminCategoryNew() {
  redirect('/admin/categories/edit/new');
}
