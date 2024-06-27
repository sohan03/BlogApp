import ConnectDB from '@/lib/config/db';
import { writeFile } from 'fs/promises';
import BlogModel from "@/lib/models/blogModel";
const { NextResponse } = require("next/server");
const fs = require('fs')

const loadDB = async () => {
  try {
    await ConnectDB();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

//API endpoint to get all blogs
export async function GET(request) {
const blogId = request.nextUrl.searchParams.get("id");
  if (blogId) {
    const blog = await BlogModel.findById(blogId);
    return NextResponse.json(blog)
  }
  else{
    const blogs = await BlogModel.find({});
    return NextResponse.json({blogs});
  }
}

// API Endpoint for uploading blogs
export async function POST(request) {
  await loadDB();

  try {
    const formData = await request.formData();
    const timestamp = Date.now();
    const image = formData.get('image');
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const path = `./public/${timestamp}_${image.name}`;
    
    await writeFile(path, buffer);
    
    const imgURL = `/${timestamp}_${image.name}`;
    console.log(`${new Date().toISOString()} => path: ${path}`);
    console.log(`${new Date().toISOString()} => imgURL: ${imgURL}`);
    
    const blogData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      author: formData.get('author'),
      image: imgURL,
      authorImg: formData.get('authorImg'),
    };

    const newBlog = await BlogModel.create(blogData);
    console.log(`${new Date().toISOString()} => Blog saved:`, newBlog);
    
    return NextResponse.json({ success: true, msg: "Blog added" });
  } catch (error) {
    console.error(`${new Date().toISOString()} => Error saving blog:`, error);
    return NextResponse.json({ success: false, msg: "Error adding blog", error: error.message });
  }
}
//creatinf endpoint to delete blog

export async function DELETE(request){
  const id = await request.nextUrl.searchParams.get('id');
  const blog = await BlogModel.findById(id);
fs.unlink(`./public${blog.image}`,()=>{})
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({msg:"Blog Deleted"});
}