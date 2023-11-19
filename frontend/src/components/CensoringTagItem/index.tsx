import actionGetTagList from "@/API/redux/actions/tags/ActionGetTagList";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import helper from "@/util/helper";
import { TagListType, TagType } from "@/util/type/Tag.type";
import { Search2Icon } from "@chakra-ui/icons";
import { stringSimilarity } from "string-similarity-js";
import {
  VStack,
  HStack,
  Button,
  Text,
  Box,
  Input,
  Collapse,
  styled,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Textarea,
  Tag,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import _ from "lodash";
import actionVerifyTag from "@/API/redux/actions/tags/ActionVerifyTag";
type State = {
  tags: TagListType | null;
  search: string;
  compareTag: TagType | null;
};
function CensoringTagItem({ tag }: { tag: TagType }) {
  const [state, setState] = useStateWithCallback<State>({
    tags: null,
    search: "",
    compareTag: null,
  });
  const dispacth = useDispatch();
  const inputRef = React.useRef<HTMLInputElement>(null);
  function verifyTag() {
    dispacth(
      actionVerifyTag(
        tag.id,
        (res: TagType) => {},
        // @ts-ignore
        (err) => {
          console.log(err);
        }
      )
    );
  }
  function searchTags(search: string) {
    setState(
      // @ts-ignoref
      (oldState) => helper.mappingState(oldState, { search: search }),
      ({ search }) => {
        const defaultLimit = 10;
        const defaultPage = 1;
        const queryParams = {
          limit: defaultLimit,
          page: defaultPage,
          search: search,
          searchBy: "name",
        };
        dispacth(
          actionGetTagList(
            queryParams,
            (res: TagListType) => {
              // @ts-ignore
              setState((oldState) =>
                helper.mappingState(oldState, { tags: res })
              );
            },
            // @ts-ignore
            (err: any) => {
              console.log(err);
            }
          )
        );
      }
    );
  }
  return (
    <VStack alignItems={"start"} flex={1} w={"full"}>
      <HStack
        w={{
          base: "100%",
          md: "30%",
        }}
        style={{
          alignItems: "center",
          alignContent: "center",
          padding: "5px",
          border: "1px solid #ccc",

          borderRadius: "5px",
          marginBlock: "20px",
        }}
        _focusWithin={{
          boxShadow: "0 0 0 2px #3182ce",
        }}
      >
        <Search2Icon
          style={{
            color: "gray",
            marginRight: "10px",
          }}
        />
        <Input
          flex={1}
          ref={inputRef}
          type="search"
          variant={"unstyled"}
          value={state.search}
          onChange={(e) => {
            searchTags(e.target.value);
          }}
          autoFocus={true}
          placeholder={"Search tags"}
          style={{
            width: "20%",
          }}
        />
      </HStack>
      <Collapse in={!_.isEmpty(state.search)} animateOpacity={true}>
        <HStack
          alignItems={"start"}
          style={{
            width: "100%",
          }}
        >
          {state.tags?.data.map((_tag: TagType) => (
            <Button
              key={tag.id}
              size={"sm"}
              onClick={() => {
                // @ts-ignore
                setState((oldState) =>
                  helper.mappingState(oldState, { compareTag: _tag })
                );
              }}
            >
              <Text>
                (
                {Math.floor(
                  stringSimilarity(tag.content as string, _tag?.content ?? "") *
                    100
                ) + "%"}
                )
              </Text>
              <Text>{_tag.name}</Text>
            </Button>
          ))}
        </HStack>
      </Collapse>
      <HStack
        style={{
          padding: "10px",
          flex: 1,
          justifyContent: "start",
          alignItems: "start",
        }}
        key={tag.id}
      >
        <TableContainer flex={1}>
          <Table
            variant="striped"
            style={{
              width: "70vw",
              border: "1px solid",
              borderColor: "#ccc",
            }}
          >
            <TableCaption>
              {state.compareTag
                ? `Compare ${tag.name} with ${state.compareTag?.name}`
                : `Tag ${tag.name}`}
            </TableCaption>
            <Thead>
              <Tr>
                <Th></Th>
                <Th>
                  <Tag>{tag.name}</Tag>
                </Th>
                {state.compareTag && (
                  <Th visibility={!state.compareTag ? "collapse" : "visible"}>
                    <Tag>{state.compareTag?.name}</Tag>
                  </Th>
                )}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Tag name:</Td>
                <Td>{tag.name}</Td>
                {state.compareTag && <Td>{state.compareTag?.name}</Td>}
              </Tr>
              <Tr>
                <Td>Tag content:</Td>
                <Td>
                  <Textarea
                    w={"full"}
                    readOnly={true}
                    minH={
                      tag.content && tag.content.length > 100
                        ? "200px"
                        : "100px"
                    }
                  >
                    {tag.content}
                  </Textarea>
                </Td>
                {state.compareTag && (
                  <Td>
                    <Textarea
                      w={"full"}
                      minH={
                        state.compareTag.content &&
                        state.compareTag.content.length > 100
                          ? "200px"
                          : "100px"
                      }
                      value={state.compareTag?.content}
                    />
                  </Td>
                )}
              </Tr>
              <Tr>
                <Td>Tag state:</Td>
                <Td>{tag.state}</Td>
                {state.compareTag && <Td>{state.compareTag?.state}</Td>}
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </HStack>
      <HStack>
        <Button colorScheme={"blue"}>Edit</Button>
        <Button colorScheme={"green"}>Verify</Button>
        <Button colorScheme={"red"}>Rejected</Button>
        <Text display={state.compareTag ? "flex" : "none"}>
          Similarity:
          {Math.floor(
            stringSimilarity(
              tag.content as string,
              state.compareTag?.content ?? ""
            ) * 100
          ) + "%"}
        </Text>
      </HStack>
    </VStack>
  );
}
const Section = styled("div", {
  baseStyle: {
    display: "flex",
    flexDir: "column",
  },
});

const ContentContainer = styled("div", {
  baseStyle: {
    display: "flex",
    flex: 1,
    flexDir: { base: "column", lg: "row" },
  },
});

const Title = styled("p", {
  baseStyle: {
    borderRadius: "5px",
    marginBottom: "5px",
    fontWeight: "bold",
  },
});

const Content = styled("p", {
  baseStyle: {
    flex: 1,
    marginBottom: "20px",
    border: "1px solid #ccc",
    padding: "5px",
  },
});

export default CensoringTagItem;
