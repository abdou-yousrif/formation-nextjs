import React from 'react'
import Image from 'next/image'
import BoxText from '@/components/Helper/BoxText'

const About = () => {
  return (
    <div className='w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>
        {/* image content */}
        <Image src="/images/about1.png" alt="about" width={600}  height={650} />
        {/* Text content */}
        <div>
            <BoxText>About us</BoxText>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mt-3 leading-[2.5rem] sm:leading-[3rem]'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, qui?
            </h1>
            <p className='mt-3 leading-relaxed text-sm sm:text-base text-gray-700'>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vero voluptatem minus quaerat 
                fugiat adipisci pariatur? Temporibus molestias ipsa assumenda delectus beatae magni ex 
                voluptatum rem officiis libero. Commodi, nostrum odio, ea iste ratione adipisci facilis 
                vero id, iusto blanditiis ut eligendi praesentium voluptatum obcaecati consequuntur. 
                Magnam aperiam blanditiis cumque earum dolorum dolores dolor sed deleniti dignissimos debitis. 
                Recusandae, tenetur rem!
            </p>
            <button className='mt-5 text-[#f68967] font-bold pb-1 border-b-2 border-[#f68967]'>
                Learn More &#8594;
            </button>
            <div className="mt-8 border-l-2 border-gray-200">
                <div className="ml-6">
                    <p className='text-gray-700 font-medium'>
                        &quot; Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                        Accusantium minus, voluptates illum, quam perspiciatis error, 
                        sunt dolorum recusandae distinctio voluptatem pariatur. &quot;
                    </p>
                    <div className="flex items-center space-x-6 mt-6">
                        <Image src="/images/yous.png" alt='User' width={40} height={40} className='rounded-full' />
                        <div>
                            <p className='font-medium'>Abdou Yousrif</p>
                            <p className='text-gray-700 text-sm'>Developpeur web</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default About
