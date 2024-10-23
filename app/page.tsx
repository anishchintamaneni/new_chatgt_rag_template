'use client';
/*eslint-disable*/

import Link from '@/components/link/Link';
import MessageBoxChat from '@/components/MessageBox';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  Img,
  Input,
  Select,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoAwesome, MdEdit, MdPerson } from 'react-icons/md';
import Bg from '../public/img/chat/bg-image.png';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

export default function Chat(props: { apiKeyApp: string }) {
  // Input States
  const [question, setQuestion] = useState<string>('');
  const [collection, setCollection] = useState<string>('HR');
  const [answer, setAnswer] = useState<string>('');
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputTimestamp, setInputTimestamp] = useState<string>('');
  const [outputTimestamp, setOutputTimestamp] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const gray = useColorModeValue('gray.500', 'white');
  const textColor = useColorModeValue('gray.800', 'white');
  const placeholderColor = useColorModeValue('gray.500', 'whiteAlpha.600');

  const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!question) {
    alert('Please enter a question.');
    return;
  }

  setLoading(true);

  // Define the payload with updated parameters
  const payload = {
    method: "llama3.1",
    question: question,  // Use the current question state
    collection: "OEA",   // Hardcoded collection as per your request
  };

  try {
    // Send the request to the API
    const response = await fetch('https://docquest.cogniai.com/api/get-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the answer.');
    }

    const result = await response.json();
    setAnswer(result.message); // Update the answer state
    setInputOnSubmit(question); // Store the submitted question
    setInputTimestamp(new Date().toLocaleString()); // Timestamp for input
    setOutputCode(result.message); // Store the output code
    setOutputTimestamp(new Date().toLocaleString()); // Timestamp for output
    setQuestion(''); // Clear input after submission
    document.getElementById('question1')?.focus(); // Refocus on the input
  } catch (error) {
    console.error('Error fetching the answer:', error);
  } finally {
    setLoading(false); // Ensure loading state is reset
  }
};

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCollection(event.target.value);
  };

  const startVoiceRecognition = () => {
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript); // Update question state with the transcribed text
      recognition.stop(); // Stop recognition after getting the result
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event);
    };
  };

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
    >
      <Img
        src={Bg.src}
        position="absolute"
        w="350px"
        left="50%"
        top="50%"
        transform="translate(-50%, -50%)"
      />
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
      >
        <Flex mb="20px">
          <Select
            placeholder="Select Catalog"
            onChange={handleChange}
            value={collection}
            color={inputColor}
            borderColor={borderColor}
            borderRadius="45px"
          >
            <option value="Catalog 1">APEX</option>
            <option value="Catalog 2">EB</option>
            <option value="Catalog 2">DOI</option>
          </Select>
        </Flex>

        <Flex
          direction="column"
          w="100%"
          mx="auto"
          display={outputCode ? 'flex' : 'none'}
          mb="auto"
        >
          <Flex w="100%" align="center" mb="10px">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg="transparent"
              border="1px solid"
              borderColor={borderColor}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon as={MdPerson} width="20px" height="20px" color={brandColor} />
            </Flex>

            <Flex
              p="22px"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px"
              w="100%"
              zIndex="2"
            >
              <Text
                color={textColor}
                fontWeight="600"
                fontSize={{ base: 'sm', md: 'md' }}
                lineHeight={{ base: '24px', md: '26px' }}
              >
                {inputOnSubmit} <Text as="span" fontSize="xs" color="gray.500">({inputTimestamp})</Text>
              </Text>
              <Icon
                cursor="pointer"
                as={MdEdit}
                ms="auto"
                width="20px"
                height="20px"
                color={gray}
              />
            </Flex>
          </Flex>

          <Flex w="100%">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg="linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)"
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon as={MdAutoAwesome} width="20px" height="20px" color="white" />
            </Flex>
            <MessageBoxChat output={outputCode} />
            <Text as="span" fontSize="xs" color="gray.500">({outputTimestamp})</Text>
          </Flex>
        </Flex>

        {/* Input box fixed at the bottom center */}
<Flex
  position="fixed"
  bottom="20px"
  w="100%"
  maxW="1000px"
  px="20px"
  justify="center"
>
  <Input
    id="question1"
    minH="54px"
    h="100%"
    border="1px solid"
    borderColor={borderColor}
    borderRadius="45px"
    p="15px 20px"
    me="10px"
    fontSize="sm"
    fontWeight="500"
    _focus={{ borderColor: 'none' }}
    color={inputColor}
    _placeholder={placeholderColor}
    placeholder="Type your message here..."
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    flex="1"
  />

  <Button
    variant="primary"
    py="20px"
    px="16px"
    fontSize="sm"
    borderRadius="45px"
    ms="auto"
    w={{ base: '160px', md: '210px' }}
    h="54px"
    _hover={{
      boxShadow:
        '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
      bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
      _disabled: {
        bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
      },
    }}
    onClick={handleSearch}
    isLoading={loading}
    mr="5px"
  >
    Submit
  </Button>

  <Button
    variant="primary"
    py="20px"
    px="16px"
    fontSize="sm"
    borderRadius="45px"
    w={{ base: '160px', md: '210px' }}
    h="54px"
    _hover={{
      boxShadow:
        '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
      bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
      _disabled: {
        bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
      },
    }}
    onClick={startVoiceRecognition}
  >
    VoiceInput
  </Button>
</Flex>
      </Flex>
    </Flex>
  );
}
