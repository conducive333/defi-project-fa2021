import * as assets from '../../assets';
import React, { ChangeEvent, useState } from 'react';
import Countdown from 'react-countdown';
import { DateTime } from 'luxon';
import { useDrawingPoolService, useNewFlowAuthenticator } from '../../hooks';
import { SingleDrawingPoolDetails } from '../../services/drawingPool';
import { Badge, Box, Button, Flex, FormControl, FormLabel, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, useToast, VStack } from '@chakra-ui/react';
import { useCurrentUser } from '../../contexts';

export const DrawingPoolsSection = () => {
  const drawingPoolService = useDrawingPoolService();
  
  return (
    <VStack spacing={12}>
      {drawingPoolService.drawingPools.map((drawingPool: SingleDrawingPoolDetails) => <ImageWithSideText drawingPool={drawingPool} />)}
    </VStack>
  );
};

const ImageWithSideText = ({ drawingPool }: { drawingPool: SingleDrawingPoolDetails }) => {
  const drawingPoolExpirationDate = DateTime.fromISO(drawingPool.endDate).toJSDate();
  const shouldShowActiveDrawingPoolElems = new Date() < drawingPoolExpirationDate;

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <HStack spacing={5}>
      <Image boxSize="200px" src={drawingPool.file.url} />
      <Box borderWidth="2px" borderRadius="lg" width="800px" height="200px" padding="15px">
        <Text fontSize="3xl">{drawingPool.name}</Text>
        <Text fontSize="xl">{drawingPool.description}</Text>
        <br />
        {shouldShowActiveDrawingPoolElems ? 
          <Countdown date={DateTime.fromISO(drawingPool.endDate).toJSDate()} renderer={({ days, hours, minutes, seconds }) => 
            <Text fontSize="lg">Time remaining: {enforceTwoDigits(hours)}:{enforceTwoDigits(minutes)}:{enforceTwoDigits(seconds)}</Text>
          } /> 
        : 
          <Badge borderRadius='full' px='5' padding="8px" colorScheme='teal'>Finished</Badge>}
        {shouldShowActiveDrawingPoolElems ? 
          <VStack>
            <Box onClick={onOpen} as='button' alignItems="flex-end" borderRadius='md' bg='green' color='white' px={8} h={8}>
              Join
            </Box>
          </VStack>
        : 
          null}
      </Box>
      <DrawingPoolSubmissionModal drawingPool={drawingPool} isOpen={isOpen} onClose={onClose} />
    </HStack>
  )
}

const DrawingPoolSubmissionModal = ({ drawingPool, isOpen, onClose }: { drawingPool: SingleDrawingPoolDetails; isOpen: boolean; onClose: () => void; }) => {
  const drawingPoolService = useDrawingPoolService();
  const [imageUrl, setImageUrl] = useState(assets.uploadImageTemplate);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const flowAuthenticator = useNewFlowAuthenticator();
  const toast = useToast();
  const user = useCurrentUser();

  const onSubmit = async () => {
    const wasSubmissionSuccessful = await drawingPoolService.submitDrawingPoolImage({ 
      drawingPoolId: drawingPool.id,
      address: flowAuthenticator.user.addr,
      name: nftName,
      description: nftDescription,
      file: imageFile
    })

    onClose();

    if (wasSubmissionSuccessful) {
      toast({
        title: 'NFT Submission Success!',
        description: "You're NFT submission was successful.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'An error occurred',
        description: "An error occurred with your NFT submission",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  }

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>NFT Submission</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <Flex display="flex" alignItems="center" justifyContent="center" alignSelf="center" >
              <Image h={72} w={72} src={imageUrl} />
            </Flex>
            <br />
            <Input fontSize="xl" type="file" hidden={true} ref={imageInputRef} onChange={onInputChange} />
            <Button width="100%" alignSelf="center" onClick={() => imageInputRef.current?.click()} >Upload NFT</Button>
          </FormControl>

          <br />

          <FormControl>
            <FormLabel fontSize="xl">NFT Name</FormLabel>
            <Input ref={initialRef} placeholder='Really Cool NFT' onChange={(e) => setNftName(e.target.value)} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel fontSize="xl">NFT Description</FormLabel>
            <Textarea height="200px" resize="both" size="lg" onChange={(e) => setNftDescription(e.target.value)} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onSubmit}>
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// Helpers

const enforceTwoDigits = (timeNumber: number) => timeNumber < 10 ? `0${timeNumber}` : timeNumber;
