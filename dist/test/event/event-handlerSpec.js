"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const C = require("../../src/constants");
const event_handler_1 = require("../../src/event/event-handler");
const testHelper = require('../test-helper/test-helper');
const test_mocks_1 = require("../test-helper/test-mocks");
const options = testHelper.getDeepstreamOptions();
const config = options.config;
const services = options.services;
describe('the eventHandler routes events correctly', () => {
    let testMocks;
    let eventHandler;
    let socketWrapper;
    beforeEach(() => {
        testMocks = test_mocks_1.getTestMocks();
        eventHandler = new event_handler_1.default(config, services, testMocks.subscriptionRegistry, testMocks.listenerRegistry);
        socketWrapper = testMocks.getSocketWrapper().socketWrapper;
    });
    afterEach(() => {
        testMocks.subscriptionRegistryMock.verify();
        testMocks.listenerRegistryMock.verify();
    });
    it('subscribes to events', () => {
        const subscriptionMessage = {
            topic: C.TOPIC.EVENT,
            action: C.EVENT_ACTIONS.SUBSCRIBE,
            name: 'someEvent'
        };
        testMocks.subscriptionRegistryMock
            .expects('subscribe')
            .once()
            .withExactArgs(subscriptionMessage, socketWrapper);
        eventHandler.handle(socketWrapper, subscriptionMessage);
    });
    it('unsubscribes to events', () => {
        const unSubscriptionMessage = {
            topic: C.TOPIC.EVENT,
            action: C.EVENT_ACTIONS.UNSUBSCRIBE,
            name: 'someEvent'
        };
        testMocks.subscriptionRegistryMock
            .expects('unsubscribe')
            .once()
            .withExactArgs(unSubscriptionMessage, socketWrapper);
        eventHandler.handle(socketWrapper, unSubscriptionMessage);
    });
    it('triggers event without data', () => {
        const eventMessage = {
            topic: C.TOPIC.EVENT,
            action: C.EVENT_ACTIONS.EMIT,
            name: 'someEvent'
        };
        testMocks.subscriptionRegistryMock
            .expects('sendToSubscribers')
            .once()
            .withExactArgs('someEvent', eventMessage, false, socketWrapper);
        eventHandler.handle(socketWrapper, eventMessage);
    });
    it('triggers event with data', () => {
        const eventMessage = {
            topic: C.TOPIC.EVENT,
            action: C.EVENT_ACTIONS.EMIT,
            name: 'someEvent',
            data: JSON.stringify({ data: 'payload' })
        };
        testMocks.subscriptionRegistryMock
            .expects('sendToSubscribers')
            .once()
            .withExactArgs('someEvent', eventMessage, false, socketWrapper);
        eventHandler.handle(socketWrapper, eventMessage);
    });
    it('registers a listener', () => {
        const listenMessage = {
            topic: C.TOPIC.EVENT,
            action: C.EVENT_ACTIONS.LISTEN,
            name: 'event/.*'
        };
        testMocks.listenerRegistryMock
            .expects('handle')
            .once()
            .withExactArgs(socketWrapper, listenMessage);
        eventHandler.handle(socketWrapper, listenMessage);
    });
    it('removes listeners', () => {
        const unlistenMessage = {
            topic: C.TOPIC.EVENT,
            action: C.EVENT_ACTIONS.UNLISTEN,
            name: 'event/.*'
        };
        testMocks.listenerRegistryMock
            .expects('handle')
            .once()
            .withExactArgs(socketWrapper, unlistenMessage);
        eventHandler.handle(socketWrapper, unlistenMessage);
    });
    it('processes listen accepts', () => {
        const listenAcceptMessage = {
            topic: C.TOPIC.EVENT,
            action: C.EVENT_ACTIONS.LISTEN_ACCEPT,
            name: 'event/.*',
            subscription: 'event/A'
        };
        testMocks.listenerRegistryMock
            .expects('handle')
            .once()
            .withExactArgs(socketWrapper, listenAcceptMessage);
        eventHandler.handle(socketWrapper, listenAcceptMessage);
    });
    it('processes listen rejects', () => {
        const listenRejectMessage = {
            topic: C.TOPIC.EVENT,
            action: C.EVENT_ACTIONS.LISTEN_REJECT,
            name: 'event/.*',
            subscription: 'event/A'
        };
        testMocks.listenerRegistryMock
            .expects('handle')
            .once()
            .withExactArgs(socketWrapper, listenRejectMessage);
        eventHandler.handle(socketWrapper, listenRejectMessage);
    });
});
//# sourceMappingURL=event-handlerSpec.js.map