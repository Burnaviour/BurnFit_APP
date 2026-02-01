import React from 'react';
import { ScrollView, View } from 'react-native';
import { ScreenWrapper, Typo, Card } from '../components/ui';

const Placeholder = ({ name }: { name: string }) => (
    <ScreenWrapper>
        <ScrollView>
            <Typo.Header>{name}</Typo.Header>
            <View style={{ height: 20 }} />
            <Card>
                <Typo.Body>This feature is being implemented.</Typo.Body>
            </Card>
        </ScrollView>
    </ScreenWrapper>
);

export default Placeholder;
