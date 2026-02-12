import { MdArrowRightAlt } from 'react-icons/md'
import { IoBookOutline } from 'react-icons/io5'
import { LiaUniversitySolid } from "react-icons/lia";
import HomeCard from '@/components/items/homeCard';
import { RiParentFill } from 'react-icons/ri';
import { LuBookOpen } from 'react-icons/lu';
import { BsGraphUp } from "react-icons/bs";
import { GrSchedules } from "react-icons/gr";
import { FaShieldAlt } from "react-icons/fa";
import { CiBookmarkCheck } from "react-icons/ci";
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <section className="flex flex-col min-w-full">
      <div className="bg-linear-to-b from-primary-light to-secondary-dark text-center py-5!">
        <div className="mx-auto!">
          <div className="w-[250px] bg-secondary-dark/20 mx-auto! flex items-center justify-center gap-2 py-1! px-2! rounded-xl shadow-2xl">
            <IoBookOutline className='w-3 h-3' />
            <p className='text-sm text-secondary-light'>School Management Platform</p>
          </div>
          <h1 className='mt-5! text-secondary-light font-medium text-2xl'>Simplify School Management with <span className='text-primary-dark'>Online Diary</span></h1>
          <p className='text-secondary-light/90 mt-5!'>The complete platform for students, teachers, and parents to stay connected and organized. Track grades, manage classes, and communicate effortlessly.</p>
          <div className="mt-5! flex flex-col md:flex-row items-center justify-center gap-2 w-full">
            <Link to={'/auth'} className='flex items-center justify-center text-center gap-3 font-medium bg-primary-light w-[200px] text-primary-dark p-3! rounded-lg'>Get Started <MdArrowRightAlt /></Link>
            <Link to={'/school'} className='font-medium bg-gray-400 w-[200px] text-primary-dark p-3! rounded-lg'>Explore Schools</Link>
          </div>
        </div>
      </div>

      <div className="bg-primary-light/60 py-5! px-5!">
        <div className="max-w-3xl mx-auto!">
          <div className="text-center">
            <h1 className='text-3xl text-primary-dark'>Everything You Need</h1>
            <p className='mt-3! text-lg text-secondary-dark/50'>Powerful features designed to make school management effortless for everyone.</p>
          </div>

          <div className="flex flex-col md:flex-row flex-wrap items-center gap-4 mt-5! p-2!">
            <HomeCard Icon={LiaUniversitySolid} text='Student Management' description='Track student progress, grades, and attendance with comprehensive dashboards.' />
            <HomeCard Icon={RiParentFill} text='Parent Portal' description='Keep parents informed with real-time updates on their children"s performance.' />
            <HomeCard Icon={LuBookOpen} text='Subject Tracking' description='Manage subjects, assignments, and curriculum across all classes efficiently.' />
            <HomeCard Icon={BsGraphUp} text='Analytics & Reports' description='Generate detailed reports and visualize academic progress over time.' />
            <HomeCard Icon={GrSchedules} text='Schedule Management' description='Organize class schedules, exams, and school events in one place.' />
            <HomeCard Icon={FaShieldAlt} text='Secure & Private' description='Your data is protected with enterprise-grade security measures.' />
          </div>
        </div>
      </div>

      <div className="bg-primary-light/60 p-5!">
        <div className="max-w-3xl mx-auto! w-full flex flex-col items-start justify-between gap-3 bg-white rounded-2xl shadow-xl p-7!">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex flex-col items-start text-left gap-4 w-full">
              <h1 className='font-medium text-3xl w-3/5'>Why Choose Online Diary?</h1>
              <p className='text-lg text-black/75 w-4/5'>Join thousands of schools already using our platform to streamline their academic processes and improve communication.</p>

              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-2">
                  <CiBookmarkCheck className='w-5 h-5' />
                  <p>Easy grade tracking and management</p>
                </div>
                <div className="flex items-center gap-2">
                  <CiBookmarkCheck className='w-5 h-5' />
                  <p>Real-time communication between teachers and parents</p>
                </div>
                <div className="flex items-center gap-2">
                  <CiBookmarkCheck className='w-5 h-5' />
                  <p>Comprehensive student profiles</p>
                </div>
                <div className="flex items-center gap-2">
                  <CiBookmarkCheck className='w-5 h-5' />
                  <p>Attendance monitoring</p>
                </div>
                <div className="flex items-center gap-2">
                  <CiBookmarkCheck className='w-5 h-5' />
                  <p>Assignment and homework tracking</p>
                </div>
                <div className="flex items-center gap-2">
                  <CiBookmarkCheck className='w-5 h-5' />
                  <p>Multi-school support</p>
                </div>
              </div>
            </div>

            <div className="relative w-[200px] py-10! sm:w-4/5 md:w-3/5 lg:w-2/5 mx-auto! animate-bounce">
              <div className="aspect-square rounded-3xl bg-linear-to-br from-primary/20 to-secondary/30 flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-card rounded-2xl shadow-xl p-6 animate-float">
                  <div className="space-y-4 h-full flex flex-col justify-around gap-3 p-5!">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-6 bg-muted rounded w-1/2" />
                    <div className="h-20 bg-primary-dark/10 rounded-lg mt-6" />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 bg-muted rounded-lg" />
                      <div className="h-16 bg-primary-dark/10 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12! flex flex-col items-center justify-center gap-4 text-center">
          <h1 className='font-medium text-xl'>Ready to Get Started?</h1>
          <p className='text-lg text-black/70'>Create your account today and start managing your school more efficiently.</p>
          <Link to={'/auth'} className='flex items-center justify-center text-center gap-3 font-medium bg-primary-light w-[200px] text-primary-dark p-3! rounded-lg'>Start Free Trial <MdArrowRightAlt /></Link>
        </div>
      </div>
    </section>
  )
}

export default Home