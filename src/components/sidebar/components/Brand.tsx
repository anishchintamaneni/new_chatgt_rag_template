// 'use client';
// // Chakra imports
// import { Flex, useColorModeValue } from '@chakra-ui/react';

// import { HorizonLogo } from '@/components/icons/Icons';
// import { HSeparator } from '@/components/separator/Separator';

// export function SidebarBrand() {
//   // //   Chakra color mode
//   // let logoColor = useColorModeValue('navy.700', 'white');

//   // return (
//   //   <Flex alignItems="center" flexDirection="column">
//   //     <HorizonLogo h="26px" w="146px" my="30px" color={logoColor} />
//   //     <HSeparator mb="20px" w="284px" />
//   //   </Flex>
//   // );
// }

// export default SidebarBrand;

'use client';
// Chakra imports
import { Flex, Image, useColorModeValue } from '@chakra-ui/react';
import { HSeparator } from '@/components/separator/Separator';

// Import your logo
import docuquestLogo from '@/components/sidebar/components/DocQuest-logo.png'; // Ensure the path is correct

export function SidebarBrand() {
  // Chakra color mode to adjust background or surrounding styles if needed
  const bgColor = useColorModeValue('white', 'navy.800'); 

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      bg={bgColor}
      p="20px"
      w="100%"
    >
      {/* Logo */}
      <Image src={docuquestLogo} alt="DocuQuest Logo" h="40px" mb="30px" />

      {/* Separator */}
      <HSeparator mb="20px" w="284px" />
    </Flex>
  );
}

export default SidebarBrand;
