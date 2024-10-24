'use client';
/*eslint-disable*/
import { Flex, Text, Icon, Img, Input, Select, Button, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { MdAutoAwesome, MdPerson } from 'react-icons/md';
import MessageBoxChat from '@/components/MessageBox';
import Bg from '../public/img/chat/bg-image.png';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function Chat(props: { apiKeyApp: string }) {
  // Input States
  const [question, setQuestion] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [collection, setCollection] = useState<string>('HR');
  const [chatHistory, setChatHistory] = useState<{ type: 'question' | 'answer'; content: string; timestamp?: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const textColor = useColorModeValue('gray.800', 'white');
  const placeholderColor = useColorModeValue('gray.500', 'whiteAlpha.600');

  // Initialize Speech Recognition
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

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
      collection: collection, // Use the selected collection
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
      const currentTimestamp = new Date().toLocaleString();

      // Append the new question and answer to the chat history
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: 'question', content: question, timestamp: currentTimestamp },
        { type: 'answer', content: result.message },
      ]);

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

  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
    document.getElementById("question1")?.focus(); // Focus on input box after listening stops
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

  useEffect(() => {
    scrollToBottom(); // Auto-scroll on every render when new messages appear
  }, [chatHistory]);

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
      overflow="hidden"  // Disable scroll for the entire page
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
        {/* Container 1: Catalog Dropdown */}
        <Flex
          mb="20px"
          w="100%" // Ensure it takes full width
          position="sticky"
          top="52"
          zIndex="1000" // Ensure it stays on top of other elements
          bg="white"
        >
          <Select
            onChange={handleChange}
            value={collection}
            color={inputColor}
            borderColor={borderColor}
            borderRadius="45px"
            w="100%" // Force full width
            h="40px" // Increased height
            zIndex="1500" // Ensure it's on top
          >
            <option value="HR">APEX</option>
            <option value="OEA">OEA</option>
            <option value="Other">EB</option>
          </Select>
        </Flex>

        {/* Container 2: Input and Output (Chat History) */}
        <Flex direction="column" w="100%" mx="auto" mb="auto" overflowY="auto" maxH="60vh">
          {/* Render chat history */}
          <Flex direction="column">
            {chatHistory.map((chatItem, index) => (
              <Flex w="100%" align="center" mb="10px" key={index}>
                {chatItem.type === 'question' ? (
                  <>
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
                        {chatItem.content} <Text as="span" fontSize="xs" color="gray.500">({chatItem.timestamp})</Text>
                      </Text>
                    </Flex>
                  </>
                ) : (
                  <>
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
                    <MessageBoxChat output={chatItem.content} />
                  </>
                )}
              </Flex>
            ))}
          </Flex>
        </Flex>

        {/* Scroll to this div on new message */}
        <div ref={messagesEndRef} />

        {/* Container 3: Input Text Box and Buttons */}
        <Flex bottom="20px" w="100%" maxW="1000px" px="20px" justify="center">
          <Input
            id="question1"
            minH="54px"
            h="70%"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="45px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={{ color: placeholderColor }}
            placeholder="Type your message here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            flex="4"
          />

          <Button
            variant="primary"
            py="15px"
            px="10px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            w={{ base: '100px', md: '120px' }}
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
            py="15px"
            px="10px"
            fontSize="sm"
            borderRadius="45px"
            w={{ base: '100px', md: '120px' }}
            h="54px"
            _hover={{
              boxShadow: '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
            }}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? 'Stop Listening' : 'Voice Input'}
          </Button>
        </Flex>

      </Flex>
    </Flex>
  );
}
