import { faker } from '@faker-js/faker'
import React from 'react'
import Post from './Post'

const temp_data = [
    {
        id: '1',
        username: 'some random donny',
        avatar: faker.image.avatar(),
        img: 'https://i.ytimg.com/vi/pAt2f0GQhtw/maxresdefault.jpg',
        caption: "This is DOPE"
    },
    {
        id: '2',
        username: 'another fella',
        avatar: faker.image.avatar(),
        img: 'https://i.ytimg.com/vi/pAt2f0GQhtw/maxresdefault.jpg',
        caption: "This is DOPE"
    }
]

function Posts() {
  return (
    <div>
        {temp_data.map((post)=>(
        <Post key={post.id} id={post.id} username={post.username} 
        userImg = {post.avatar} img ={post.img} caption={post.caption}/>
        ))}
    </div>
  )
}

export default Posts