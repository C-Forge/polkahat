type BodyContent = string | number[] | Record<string, any>;

interface BodyItem {
  name: string;
  body?: BodyContent;
  isResult: boolean;
  isPrimitive: boolean;
  isConvertable: boolean;
}

interface EventBody {
  [key: string]: BodyItem;
}

interface EventDescriptor {
  name: string;
  body: EventBody;
  isResult: boolean;
  isPrimitive: boolean;
  isConvertable: boolean;
  signatureTopic: string;
}

export interface EventTypeDescriptions {
  [signatureTopic: string]: EventDescriptor;
}
