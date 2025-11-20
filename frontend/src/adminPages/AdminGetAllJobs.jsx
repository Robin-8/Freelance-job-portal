import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../api/axiosApi'

const AdminGetAllJobs = () => {
    const {token}=useSelector((state)=>state.client)

    const {data}=useQuery({
        queryKey:["getJobs"],
        queryFn:async()=>{
            const res = await axiosInstance.get('/admin/getJobs',{
                 headers: { Authorization: `Bearer ${token}` },
            })
            return res.data.jobs
        }
    })
  return (
    <div>AdminGetAllJobs</div>
  )
}

export default AdminGetAllJobs