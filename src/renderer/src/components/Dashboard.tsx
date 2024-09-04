import ShowData from "./showData"
import ShowImages from "./ImageManager"
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
        <div className='h-screen flex items-center justify-center'>
          <ShowImages />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default Dashboard