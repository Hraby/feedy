import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const sections = [
  { title: "Obecné", items: [
      { label: "Kontaktní informace", content: "Tel.: + 420 123 456 789\nE-mail: podpora@feedy.cz\nAdresa: U Rozhledny 623, Zlín 760 01" },
      { label: "Podmínky použití", content: "Používáním aplikace Feedy souhlasíte s těmito podmínkami použití.\nUživatel je povinen uvádět pravdivé informace při registraci.\nObjednávka je závazná po jejím potvrzení v aplikaci.\nPlatba za objednané zboží probíhá prostřednictvím dostupných platebních metod.\nČas doručení je orientační a může se lišit podle aktuální situace.\nFeedy nenese odpovědnost za zpoždění nebo zrušení objednávky způsobené třetími stranami.\nUživatel může kdykoli zrušit svůj účet prostřednictvím nastavení aplikace.\nFeedy si vyhrazuje právo kdykoli změnit tyto podmínky použití."},
      { label: "Soukromí", content: "Veškeré osobní údaje jsou zpracovávány v souladu s platnými právními předpisy." },
      { label: "O Nás", content: "Informace o naší společnosti." }
    ]
  },
  { title: "Osobní", items: [
      { label: "Zrušení účtu", content: "Pro zrušení účtu nás prosím kontaktujte na: zruseni@feedy.cz" }
    ]
  }
];

const InfoMenuPage = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index: any) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}
              onPress={() => router.push('/usermenu')}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      <Text style={styles.header}>Informace</Text>
      {sections.map((section, index) => (
        <View key={index}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <View key={itemIndex}>
              <TouchableOpacity onPress={() => toggleSection(`${index}-${itemIndex}`)}>
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
              {openSection === `${index}-${itemIndex}` && (
                <Text style={styles.dropdownText}>{item.content}</Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#EBEBEB',
    padding: 8,
    borderRadius: 20,
  },
  backText: {
    fontSize: 18,
  },
  header: {
    fontSize: 16,
    fontFamily: "Montserrat", 
    marginTop: 40,
    color: "#000000",
    marginLeft: 300,
    fontWeight: "400",
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Montserrat", 
    marginTop: 30,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 18,
    paddingVertical: 10,
    fontFamily: "Montserrat", 
    color: "black",
    fontWeight: "400",
  },
  dropdownText: {
    fontSize: 16,
    color: "black",
    fontFamily: "Montserrat", 
    marginLeft: 10,
    marginBottom: 15,
  }
});

export default InfoMenuPage;
