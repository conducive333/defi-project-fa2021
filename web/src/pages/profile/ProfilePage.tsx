import React from 'react';
import { Navbar } from '../../components';
import { Box, Button, Flex, HStack, Image, Link, Tabs, TabList, TabPanels, Tab, TabPanel, Text, VStack } from "@chakra-ui/react";
import { DrawingPoolsSection } from './DrawingPoolsSection';

export const ProfilePage = () => {
  return (
    <div className="App" style={{ alignItems: 'center' }}>
      <Navbar />
      <br />
      <Tabs size="lg" variant="enclosed" isLazy isFitted style={{ boxShadow: 'none' }}>
        <TabList style={{ boxShadow: 'none' }}>
          <Tab fontSize="xl" style={{ boxShadow: 'none' }}>Drawing Pools</Tab>
          <Tab fontSize="xl" style={{ boxShadow: 'none' }}>My Collection</Tab>
          <Tab fontSize="xl" style={{ boxShadow: 'none' }}>My Market Listings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DrawingPoolsSection />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
