package com.friendsplus.friendsplus.controller;

import com.friendsplus.friendsplus.model.Group;
import com.friendsplus.friendsplus.model.Message;
import com.friendsplus.friendsplus.model.User;
import com.friendsplus.friendsplus.repository.GroupRepository;
import com.friendsplus.friendsplus.repository.MessageRepository;
import com.friendsplus.friendsplus.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;


    public MessageController(MessageRepository messageRepository,
                             UserRepository userRepository,
                             GroupRepository groupRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
    }


    @GetMapping("/{u1}/{u2}")
    public List<Message> getChat(@PathVariable Long u1, @PathVariable Long u2) {
        return messageRepository.findChatHistory(u1, u2);
    }


    @GetMapping("/group/{groupId}")
    public List<Map<String, Object>> getGroupChat(@PathVariable Long groupId) {
        List<Message> messages = messageRepository.findByGroupIdOrderBySentAtAsc(groupId);
        return messages.stream().map(m -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("content", m.getContent());
            map.put("sentAt", m.getSentAt());
            Map<String, Object> senderMap = new HashMap<>();
            senderMap.put("id", m.getSender().getId());
            senderMap.put("username", m.getSender().getUsername());
            map.put("sender", senderMap);
            return map;
        }).collect(Collectors.toList());
    }

    @PostMapping("/send")
    public Message sendMessage(@RequestParam Long senderId,
                               @RequestParam(required = false) Long receiverId,
                               @RequestParam(required = false) Long groupId,
                               @RequestBody String content) {

        User sender = userRepository.findById(senderId).orElseThrow();
        Message msg = new Message();
        msg.setSender(sender);
        msg.setContent(content);

        if (receiverId != null) {
            User receiver = userRepository.findById(receiverId).orElseThrow();
            msg.setReceiver(receiver);
        }

        if (groupId != null) {
            Group group = groupRepository.findById(groupId).orElseThrow();
            msg.setGroup(group);
        }

        return messageRepository.save(msg);
    }
}