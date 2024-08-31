import ShowData from "./showData"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/ResizablePanel"


const Dashboard = ({data}) => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w max-h"
    >
      <ResizablePanel defaultSize={65}>
        <div className=''>
            <ShowData data={data}/>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={35}>
        <div className=''>
          <p></p>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default Dashboard