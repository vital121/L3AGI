import { useState } from 'react'
import styled from 'styled-components'

import Tab from '@l3-lib/ui-core/dist/Tab'
import TabList from '@l3-lib/ui-core/dist/TabList'
import TabPanel from '@l3-lib/ui-core/dist/TabPanel'
import TabPanels from '@l3-lib/ui-core/dist/TabPanels'
import TabsContext from '@l3-lib/ui-core/dist/TabsContext'
import AvatarGenerator from 'components/AvatarGenerator/AvatarGenerator'

const ChatMembers = ({
  agentById,
  teamOfAgents,
  user,
}: {
  agentById: any
  teamOfAgents: any
  user: any
}) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <TabList size='small'>
        <Tab onClick={() => setActiveTab(0)}>Members</Tab>
        <Tab onClick={() => setActiveTab(1)}>Info</Tab>
      </TabList>

      <TabsContext activeTabId={activeTab}>
        <TabPanels noAnimation>
          <TabPanel>
            <StyledAgentWrapper>
              <AvatarGenerator name={user.name} size={30} />
              {user.name}
            </StyledAgentWrapper>
            {agentById && (
              <>
                <StyledAgentWrapper>
                  <AvatarGenerator name={agentById?.agent?.name} size={30} />
                  {agentById?.agent?.name}
                </StyledAgentWrapper>
              </>
            )}

            {teamOfAgents &&
              teamOfAgents.team_agents?.map((agentData: any, index: number) => {
                return (
                  <StyledAgentWrapper key={index}>
                    <AvatarGenerator name={agentData.agent.name} size={30} />
                    {agentData.agent.name}
                  </StyledAgentWrapper>
                )
              })}
          </TabPanel>

          <TabPanel>info</TabPanel>
        </TabPanels>
      </TabsContext>
    </>
  )
}

export default ChatMembers

const StyledAgentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  padding: 10px;
  /* border-radius: 10px;
  background: rgba(0, 0, 0, 0.4); */
`