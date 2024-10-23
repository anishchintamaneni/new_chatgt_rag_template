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
import { useEffect, useRef, useState } from 'react';
import { MdAutoAwesome, MdEdit, MdPerson } from 'react-icons/md';
import Bg from '../public/img/chat/bg-image.png';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

export default function Chat(props: { apiKeyApp: string }) {
  // Input States
  const [question, setQuestion] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [collection, setCollection] = useState<string>('HR');
  const [answer, setAnswer] = useState<string>('');
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputTimestamp, setInputTimestamp] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling

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
  const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); // Scroll smoothly to the bottom
};

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) {
      alert('Please enter a question.');
      return;
    }

    setLoading(true);

    const payload = {
      method: "llama3.1",
      question: question,
      collection: "OEA",
    };

    try {
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
      setAnswer(result.message);
      setInputOnSubmit(question);
      setInputTimestamp(new Date().toLocaleString());
      setOutputCode(result.message);
      setQuestion('');
      document.getElementById('question1')?.focus();

      // Scroll to the bottom of the chat window
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching the answer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCollection(event.target.value);
  };

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const startListening = () => {
  setIsListening(true);
  recognition.start();
};

const stopListening = () => {
  setIsListening(false);
  recognition.stop();
  document.getElementById("question1").focus(); // Focus on input box after listening stops
};

recognition.onresult = (event) => {
  let transcript = '';
  for (let i = event.resultIndex; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript;
  }
  setQuestion(transcript); // Set the captured voice input as the question
};

recognition.onerror = (event) => {
  console.error("Error occurred in speech recognition:", event.error);
};

const setNewAnswer = (nanswer) => {
  setAnswer(nanswer);
  const answer = nanswer;
  const newPrompt = { question, answer, collection };
  setEntries((entries) => [...entries, newPrompt]);
  setQuestion(''); // Clear the input after submitting
};

useEffect(() => {
  scrollToBottom(); // Auto-scroll on every render when new messages appear
}, [inputOnSubmit, outputCode]);

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
    onChange={handleChange}
    value={collection}
    color={inputColor}
    borderColor={borderColor}
    borderRadius="45px"
  >
    <option value="Catalog 1">APEX</option>
    <option value="Catalog 2">EB</option>
    <option value="Catalog 3">DOI</option>
  </Select>
</Flex>
        <Flex direction="column" w="100%" mx="auto" mb="auto" overflowY="auto">
          {/* Chat history */}
          <Flex direction="column">
            {inputOnSubmit && (
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
                >
                  <Text
                    color={textColor}
                    fontWeight="600"
                    fontSize={{ base: 'sm', md: 'md' }}
                    lineHeight={{ base: '24px', md: '26px' }}
                  >
                    {inputOnSubmit} <Text as="span" fontSize="xs" color="gray.500">({inputTimestamp})</Text>
                  </Text>
                </Flex>
              </Flex>
            )}

            {outputCode && (
              <Flex w="100%" mb="10px">
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
              </Flex>
            )}
          </Flex>

          {/* Scroll to this div on new message */}
          <div ref={messagesEndRef} />
        </Flex>

        {/* Input box fixed at the bottom center */}
        <Flex position="fixed" bottom="20px" w="100%" maxW="1000px" px="20px" justify="center">
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
              boxShadow: '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
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
    boxShadow: '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
    bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
  }}
  onClick={isListening ? stopListening : startListening} // Toggle between start and stop
>
  {isListening ? 'Stop Listening' : 'VoiceInput'}
</Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
