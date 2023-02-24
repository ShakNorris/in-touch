import React from 'react'

function SidebarOption({Icon, Title, Number, selected}) {
  return (
    <div className="navBtn m-4 mt-3 h-10 pt-1">
        <Icon className='h-7 w-7'/>
        <h3>{Title}</h3>
    </div>
  )
}

export default SidebarOption