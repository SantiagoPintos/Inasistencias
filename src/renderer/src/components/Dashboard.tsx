import ShowData from "./showData"

const Dashboard = ({data}) => {
  return (
    <div className='w-100 flex'>
        <div className='w-7/12'>
            <ShowData data={data}/>
        </div>
        <div className='w-5/12'>
          <p></p>
        </div>
    </div>
  )
}

export default Dashboard